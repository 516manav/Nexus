import config from './config.js';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

function capitalize(str) {
    return str.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

export default function socketSetup(io, db) {

    async function unreadMessages(newMessage) {
        const result = await db.query('SELECT messagecount FROM unreadmessages WHERE userid = $1 AND senderid = $2', [newMessage.receiverid, newMessage.senderid]);
        if(result.rows.length === 0)
        await db.query("INSERT INTO unreadmessages VALUES($1, $2, $3)", [newMessage.receiverid, newMessage.senderid, 1]);
        else
        await db.query("UPDATE unreadmessages SET messagecount = $3 WHERE userid = $1 AND senderid = $2", [newMessage.receiverid, newMessage.senderid, result.rows[0].messagecount+1]);
        return true;
    }

    async function unreadGroupMessages(newMessage, userId) {
        const result = await db.query('SELECT messagecount FROM unreadgroupmessages WHERE userid = $1 AND groupid = $2', [userId, newMessage.groupid]);
        if(result.rows.length === 0)
        await db.query("INSERT INTO unreadgroupmessages VALUES($1, $2, $3)", [userId, newMessage.groupid, 1]);
        else
        await db.query("UPDATE unreadgroupmessages SET messagecount = $3 WHERE userid = $1 AND groupid = $2", [userId, newMessage.groupid, result.rows[0].messagecount+1]);
        return true;
    }

    io.on("connection", socket => {

        socket.on('join-room', userId => {
            socket.join(userId);
            console.log(`Socket ${socket.id} joined room ${userId}`);
        })
        
        socket.on('details', async user => {
            const details = {
                users: [],
                groups: [],
                favourites: []
            };
            let result = await db.query('SELECT id, email, username AS name, messagecount FROM users INNER JOIN unreadmessages ON senderid = users.id WHERE userid = $1 UNION SELECT id, email, username AS name, 0 AS messagecount FROM users WHERE users.id NOT IN (SELECT senderid FROM unreadmessages WHERE userid = $1) ORDER BY messagecount DESC', [user.id]);
            details.users = result.rows;
            result = await db.query('SELECT gn.id AS id, gn.groupName AS name, messagecount FROM groupNames AS gn INNER JOIN unreadgroupmessages ON groupid = gn.id WHERE userId = $1 UNION SELECT id, groupname AS name, 0 AS messagecount FROM groupnames INNER JOIN groupdetails ON groupid = groupnames.id WHERE userid = $1 AND groupnames.id NOT IN (SELECT groupid FROM unreadgroupmessages WHERE userid = $1) ORDER BY messagecount DESC', [user.id]);
            details.groups = result.rows;
            result = await db.query('SELECT id, email, username AS name, messagecount FROM unreadmessages INNER JOIN favourites ON favouriteId = senderid INNER JOIN users ON favouriteId = users.id WHERE unreadmessages.userid = $1 UNION SELECT id, email, username AS name, 0 AS messagecount FROM favourites INNER JOIN users ON favouriteId = users.id WHERE favouriteId NOT IN (SELECT senderid FROM unreadmessages WHERE userid = $1) ORDER BY messagecount DESC', [user.id]);
            details.favourites = result.rows;
            io.to(user.id).emit('receive-details', details);
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
            socket.emit('update-profile');
        });
        
        socket.on('delete-favourite', async (userId, favouriteId) => {
            await db.query('DELETE FROM favourites WHERE userId = $1 AND favouriteId = $2', [userId, favouriteId]);
            socket.emit('update-profile');
        });

        socket.on('create-group', async (groupName, members, useremail) => {
            const groupId = await db.query('INSERT INTO groupnames (groupname, createdby) VALUES ($1, $2) RETURNING id', [groupName, useremail]);
            for(const member of members) {
                const userId = await db.query('SELECT id FROM users WHERE email = $1', [member]);
                await db.query('INSERT INTO groupdetails VALUES ($1, $2)', [groupId.rows[0].id, userId.rows[0].id]);
                io.to(userId.rows[0].id).emit('update-profile');
            }
        });

        socket.on('get-group-info', async groupId => {
            const group = await db.query('SELECT groupname, created, createdby FROM groupNames WHERE groupNames.id = $1', [groupId]);
            const groupMembers = await db.query('SELECT id, email, username FROM users INNER JOIN groupDetails ON users.id = groupDetails.userid WHERE groupid = $1', [groupId]);
            socket.emit('group-info', group.rows[0], groupMembers.rows);
        });

        socket.on('leave-group', async (user, groupId) => {
            let members = await db.query('SELECT userid FROM groupdetails WHERE groupid = $1 AND userid != $2', [groupId, user.id]);
            const leaveMessage = {id: uuidv4(), type: 1, senderid: user.id, groupid: groupId, textmessage: `${user.username} ~ ${user.email} left.`};
            db.query('INSERT INTO groupmessages (id, senderid, groupid, textmessage, messagetype) VALUES ($1, $2, $3, $4, $5)', [leaveMessage.id, leaveMessage.senderid, leaveMessage.groupid, leaveMessage.textmessage, leaveMessage.type]);
            members.rows.forEach(member => {
                io.to(member.userid).emit('group-members', members.rows);
                io.to(member.userid).emit('receive-group-message', leaveMessage);
                db.query('INSERT INTO groupmessagedetails VALUES ($1, $2)', [member.userid, leaveMessage.id]);
            });
            await db.query('DELETE FROM groupdetails WHERE groupid = $1 AND userid = $2', [groupId, user.id]);
            db.query('DELETE FROM groupmessagedetails WHERE userid = $1 AND messageid IN (SELECT id FROM groupmessages WHERE groupid = $2)', [user.id, groupId]);
            const memberCount = await db.query('SELECT COUNT(userid) FROM groupdetails WHERE groupid = $1', [groupId]);
            if(memberCount.rows[0].count === '0')
            await db.query('DELETE FROM groupnames WHERE id = $1', [groupId]);
            socket.emit('update-profile');
        });

        socket.on('get-personal-messages', async (userId, userClickedId) => {
            const result = await db.query('SELECT personalmessages.id AS id, senderid, username AS sendername, email AS senderemail, receiverid, textmessage, messagetime FROM personalmessagedetails INNER JOIN personalmessages ON personalmessages.id = messageid INNER JOIN users ON senderid = users.id WHERE userid = $1 AND ((senderid = $1 AND receiverid = $2) OR (senderid = $2 AND receiverid = $1)) ORDER BY messagetime ASC', [userId, userClickedId]);
            socket.emit('messages', result.rows);
        });

        socket.on('get-group-members', async groupId => {
            const result = await db.query('SELECT userid FROM groupdetails WHERE groupid = $1', [groupId]);
            socket.emit('group-members', result.rows);
        });

        socket.on('get-group-messages', async (userId, groupId) => {
            const result = await db.query('SELECT groupmessages.id AS id, senderid, groupid, username AS sendername, email AS senderemail, textmessage, messagetime, messagetype AS type FROM groupmessagedetails INNER JOIN groupmessages ON groupmessages.id = messageid INNER JOIN users ON senderid = users.id WHERE userid = $1 AND groupid = $2 ORDER BY messagetime ASC', [userId, groupId]);
            socket.emit('messages', result.rows);
        });

        socket.on('send-personal-message', async newMessage => {
            if(io.sockets.adapter.rooms.has(newMessage.receiverid))
            io.to(newMessage.receiverid).emit('receive-personal-message', newMessage);
            else
            unreadMessages(newMessage);
            socket.to(newMessage.senderid).emit('receive-personal-message', newMessage);
            const result = await db.query('INSERT INTO personalmessages (id, senderid, receiverid, textmessage) VALUES ($1, $2, $3, $4) RETURNING id', [newMessage.id, newMessage.senderid, newMessage.receiverid, newMessage.textmessage]);
            db.query('INSERT INTO personalmessagedetails VALUES ($1, $2)', [newMessage.senderid, result.rows[0].id]);
            db.query('INSERT INTO personalmessagedetails VALUES ($1, $2)', [newMessage.receiverid, result.rows[0].id]);
        });

        socket.on('send-group-message', async (newMessage, members) => {
            members.forEach(member => {
                if(io.sockets.adapter.rooms.has(member))
                io.to(member).emit('receive-group-message', newMessage);
                else
                unreadGroupMessages(newMessage, member);             
            });
            socket.to(newMessage.senderid).emit('receive-group-message', newMessage);
            db.query('INSERT INTO groupmessages (id, senderid, groupid, textmessage) VALUES ($1, $2, $3, $4)', [newMessage.id, newMessage.senderid, newMessage.groupid, newMessage.textmessage]);
            db.query('INSERT INTO groupmessagedetails VALUES ($1, $2)', [newMessage.senderid, newMessage.id]);
            members.forEach(member => {
                db.query('INSERT INTO groupmessagedetails VALUES ($1, $2)', [member, newMessage.id]);
            })
        });

        socket.on('unread-message', async newMessage => {
           const output = await unreadMessages(newMessage);
           const result = await db.query('SELECT id, email, username AS name, messagecount FROM users INNER JOIN unreadmessages ON senderid = users.id WHERE userid = $1 AND senderid = $2', [newMessage.receiverid, newMessage.senderid]);
           io.to(newMessage.receiverid).emit('unread-update', result.rows[0]);
        });

        socket.on('unread-group-message', async (newMessage, userId) => {
           const output = await unreadGroupMessages(newMessage, userId);
           const result = await db.query('SELECT id, groupname AS name, messagecount FROM groupnames INNER JOIN unreadgroupmessages ON groupid = groupnames.id WHERE userid = $1 AND groupid = $2', [userId, newMessage.groupid]);
           io.to(userId).emit('unread-update', result.rows[0]);
        });

        socket.on('remove-unread', (userId, userClickedId, isGroup) => {
            if(isGroup) {
                db.query('DELETE FROM unreadgroupmessages WHERE userid = $1 AND groupid = $2', [userId, userClickedId]);
                io.to(userId).emit('removed-unread', userClickedId, isGroup);
            } else {
                db.query('DELETE FROM unreadmessages WHERE userid = $1 AND senderid = $2', [userId, userClickedId]);
                io.to(userId).emit('removed-unread', userClickedId, isGroup);
            }
        });

        socket.on('delete-for-everyone', (messageid, user, userClicked, isGroup) => {
            io.to(user).emit('deleted', messageid, true);
            if(isGroup) {
                db.query('DELETE FROM groupmessages WHERE id = $1', [messageid]);
                userClicked.forEach(member => io.to(member).emit('deleted', messageid, true));
            } else {
                db.query('DELETE FROM personalmessages WHERE id = $1', [messageid]);
                io.to(userClicked).emit('deleted', messageid, true);
            }
        });

        socket.on('delete-for-me', async (messageid, user, isGroup) => {
            io.to(user).emit('deleted', messageid, false);
            if(isGroup) {
                await db.query('DELETE FROM groupmessagedetails WHERE userid = $1 AND messageid = $2', [user, messageid]);
                const result = await db.query('SELECT COUNT(userid) FROM groupmessagedetails WHERE messageid = $1', [messageid]);
                if(result.rows[0].count === '0')
                db.query('DELETE FROM groupmessages WHERE id = $1', [messageid]);
            } else {
                await db.query('DELETE FROM personalmessagedetails WHERE userid = $1 AND messageid = $2', [user, messageid]);
                const result = await db.query('SELECT COUNT(userid) FROM personalmessagedetails WHERE messageid = $1', [messageid]);
                if(result.rows[0].count === '0')
                db.query('DELETE FROM personalmessages WHERE id = $1', [messageid]);
            }
        });

        socket.on('clear-chat', async (userId, userClickedId, isGroup) => {
            io.to(userId).emit('chat-cleared');
            let result;
            if(isGroup)
            result = await db.query('SELECT id FROM groupmessages WHERE groupid = $1', [userClickedId]);
            else
            result = await db.query('SELECT id FROM personalmessages WHERE (senderid = $1 AND receiverid = $2) OR (senderid = $2 AND receiverid = $1)', [userId, userClickedId]);
            result.rows.forEach( async message => {
                if(isGroup) {
                    await db.query('DELETE FROM groupmessagedetails WHERE messageid = $1 AND userid = $2', [message.id, userId]);
                    const res = await db.query('SELECT COUNT(userid) FROM groupmessagedetails WHERE messageid = $1', [message.id]);
                    if(res.rows[0].count === '0')
                    db.query('DELETE FROM groupmessages WHERE id = $1', [message.id]);
                } else {
                    await db.query('DELETE FROM personalmessagedetails WHERE messageid = $1 AND userid = $2', [message.id, userId]);
                    const res = await db.query('SELECT COUNT(userid) FROM personalmessagedetails WHERE messageid = $1', [message.id]);
                    if(res.rows[0].count === '0')
                    db.query('DELETE FROM personalmessages WHERE id = $1', [message.id]);
                }
            });
        });

        socket.on('logout', userId => {
            io.to(userId).emit('socket-disconnected');
            io.sockets.adapter.rooms.delete(userId);
        });

        socket.on('disconnect', () => {
            console.log('socket disconnected ',socket.id);
        });
    });
}
