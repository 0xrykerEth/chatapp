const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    loggedin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
}, {
    tableName: 'user',
    timestamps: false
});

const Group = sequelize.define('group', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    createdBy: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'group',
    timestamps: false
});

const GroupMember = sequelize.define('groupmembers', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    groupId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Group,
            key: 'id'
        },
        onDelete: 'CASCADE'
    }
}, {
    tableName: 'groupMember',
    timestamps: false
});

const Message = sequelize.define('message', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
     groupId: {
         type: DataTypes.INTEGER,
         allowNull: false,
         references: {
             model: Group,
             key: 'id'
         },
         onDelete: 'CASCADE'
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    message: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'message',
    timestamps: false
});



User.hasMany(Message, { foreignKey: 'userId' });
Message.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Group, { foreignKey: 'createdBy' });
Group.belongsTo(User, { foreignKey: 'createdBy' });

Group.hasMany(Message, { foreignKey: 'groupId' });
Message.belongsTo(Group, { foreignKey: 'groupId' });

User.belongsToMany(Group, { through: GroupMember, foreignKey: 'userId' });
Group.belongsToMany(User, { through: GroupMember, foreignKey: 'groupId' });

Group.hasMany(GroupMember, { foreignKey: 'groupId' });
GroupMember.belongsTo(Group, { foreignKey: 'groupId' });

User.hasMany(GroupMember, { foreignKey: 'userId' });
GroupMember.belongsTo(User, { foreignKey: 'userId' });




module.exports = { User, Group, GroupMember, Message };
