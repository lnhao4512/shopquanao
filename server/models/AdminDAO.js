const { connectDB } = require('../utils/MongooseUtil');
const Models = require('./Models');
const mongoose = require('mongoose');
const CryptoUtil = require('../utils/CryptoUtil');
const { isMongoReady, useInMemoryFallback } = require('../utils/DbMode');
const { store, oid, clone } = require('../utils/InMemoryStore');

const AdminDAO = {
  async selectByUsernameAndPassword(username, password) {
    await connectDB();
    const bcrypt = require('bcryptjs');
    if (!isMongoReady() && useInMemoryFallback()) {
      const admin = store.admins.find((a) => {
        if (a.username !== username) return false;
        if (a.password && (a.password.startsWith('$2a$') || a.password.startsWith('$2b$'))) {
          return bcrypt.compareSync(String(password), a.password);
        }
        return a.password === password;
      });
      return admin ? clone(admin) : null;
    }
    const query = { username: username };
    const admin = await Models.Admin.findOne(query).exec();
    if (!admin) return null;

    if (admin.password && (admin.password.startsWith('$2a$') || admin.password.startsWith('$2b$'))) {
      if (bcrypt.compareSync(String(password), admin.password)) return admin;
      return null;
    }

    const md5Password = CryptoUtil.md5(String(password));
    if (admin.password === password || admin.password === md5Password) return admin;
    return null;
  },
  async selectAll() {
    await connectDB();
    if (!isMongoReady() && useInMemoryFallback()) return clone(store.admins);
    const admins = await Models.Admin.find({});
    return admins;
  },
  async insert(username, password) {
    await connectDB();
    const bcrypt = require('bcryptjs');
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(String(password), salt);

    if (!isMongoReady() && useInMemoryFallback()) {
      const admin = { _id: oid(), username, password: hashedPassword };
      store.admins.push(admin);
      return clone(admin);
    }
    const admin = new Models.Admin({
      _id: new mongoose.Types.ObjectId(),
      username: username,
      password: hashedPassword
    });
    await admin.save();
    return admin;
  }
};
module.exports = AdminDAO;