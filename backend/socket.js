
export default function socketSetup(io, db) {
    io.on("connection", socket => {
        
        socket.on('details', async user => {
            const details = {
                users: [],
                groups: [],
                initialMessages: [],
                favourites: []
            };
            let result = await db.query('SELECT id, email, username AS name FROM users');
            details.users = result.rows;
            result = await db.query('SELECT gn.id AS id, gn.groupName AS name FROM groupNames AS gn INNER JOIN groupDetails AS gd ON gn.id = gd.groupId WHERE userId = $1', [user.id]);
            details.groups = result.rows;
            result = await db.query('SELECT id, email, username AS name FROM users INNER JOIN favourites ON favouriteId = id WHERE userId = $1', [user.id]);
            details.favourites = result.rows;
            result = await db.query('SELECT (senderId, receiverId, message, created) FROM messages WHERE userId = $1', [user.id]);
            details.initialMessages = result.rows;
            socket.emit('receive-details', details);
        });

        socket.on('disconnect', () => {
            console.log('socket disconnected ',socket.id);
        })
    });
}
