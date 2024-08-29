import config from './config.js';
import bcrypt from 'bcrypt';

function capitalize(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

export default function socketSetup(io, db) {
    io.on("connection", socket => {
        
        socket.on('details', async user => {
            const details = {
                users: [],
                groups: [],
                favourites: []
            };
            let result = await db.query('SELECT id, email, username AS name FROM users');
            details.users = result.rows;
            result = await db.query('SELECT gn.id AS id, gn.groupName AS name FROM groupNames AS gn INNER JOIN groupDetails AS gd ON gn.id = gd.groupId WHERE userId = $1', [user.id]);
            details.groups = result.rows;
            result = await db.query('SELECT id, email, username AS name FROM users INNER JOIN favourites ON favouriteId = id WHERE userId = $1', [user.id]);
            details.favourites = result.rows;
            socket.emit('receive-details', details);
        });

        socket.on('delete-user', async userId => {
            await db.query('DELETE FROM users WHERE id = $1', [userId]);
        });

        socket.on('get-user-profile', async userId => {
            const result = await db.query('SELECT email, username AS name, status, password FROM users WHERE id = $1', [userId]);
            socket.emit('user-profile', result.rows[0]);
        });

        socket.on('update-user-profile', async (profile, userId) => {
            let result = {rows: ['error']};
            if(profile.password === 'google' && profile.newPassword !== '') {
                const hash = await bcrypt.hash(profile.newPassword, config.SALT_ROUNDS);
                result = await db.query('UPDATE users SET email = $1, password = $2, username = $3, status = $4 WHERE id = $5 RETURNING email, password, username AS name, status', [profile.email, hash, capitalize(profile.name), profile.status, userId]);
            }else if(profile.newPassword === '' && profile.currentPassword === '')
                result = await db.query('UPDATE users SET email = $1, username = $2, status = $3 WHERE id = $4 RETURNING email, password, username AS name, status', [profile.email, capitalize(profile.name), profile.status, userId]);
            else {
                const match = await bcrypt.compare(profile.currentPassword, profile.password);
                if(match){
                    const hash = await bcrypt.hash(profile.newPassword, config.SALT_ROUNDS);
                    result = await db.query('UPDATE users SET email = $1, password = $2,  username = $3, status = $4 WHERE id = $5 RETURNING email, password, username AS name, status', [profile.email, hash, capitalize(profile.name), profile.status, userId]);
                }
            }
            socket.emit('user-profile', result.rows[0]);
        });

        socket.on('add-favourite', async (userId, favouriteId) => {
            await db.query('INSERT INTO favourites VALUES ($1, $2)', [userId, favouriteId]);
        });
        
        socket.on('delete-favourite', async (userId, favouriteId) => {
            await db.query('DELETE FROM favourites WHERE userId = $1 AND favouriteId = $2', [userId, favouriteId]);
        });

        socket.on('create-group', async (groupName, members, userId) => {
            const groupId = await db.query('INSERT INTO groupnames (groupname, createdby) VALUES ($1, $2) RETURNING id', [groupName, userId]);
            members.forEach(async (member) => {
                const userId = await db.query('SELECT id FROM users WHERE email = $1', [member]);
                await db.query('INSERT INTO groupdetails VALUES ($1, $2)', [groupId.rows[0].id, userId.rows[0].id]);
            });
        });

        socket.on('get-group-info', async groupId => {
            const group = await db.query('SELECT groupname, created, email FROM groupNames INNER JOIN users ON users.id = groupNames.createdby WHERE groupNames.id = $1', [groupId]);
            const groupMembers = await db.query('SELECT email, username FROM users INNER JOIN groupDetails ON users.id = groupDetails.userid WHERE groupid = $1', [groupId]);
            socket.emit('group-info', group.rows[0], groupMembers.rows);
        });

        socket.on('leave-group', async (userId, groupId) => {
            await db.query('DELETE FROM groupdetails WHERE groupid = $1 AND userid = $2', [groupId, userId]);
            const memberCount = await db.query('SELECT COUNT(userid) FROM groupdetails WHERE groupid = $1', [groupId]);
            if(memberCount.rows[0].count === '0')
            await db.query('DELETE FROM groupnames WHERE id = $1', [groupId]);
        });

        socket.on('disconnect', () => {
            console.log('socket disconnected ',socket.id);
        });
    });
}
