const { User, Thought } = require('../models');

module.exports = {
  // Get all users
  async getUsers(req, res) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Get a single user
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId })
      .populate('thoughts') 
      .populate('friends')
        .select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },
  // Delete a user
  async deleteUser(req, res) {
    try {
      const user = await User.findOneAndDelete({ _id: req.params.userId });

      if (!user) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      await Thought.deleteMany({ _id: { $in: user.thoughts } });
      res.json({ message: 'User and associated apps deleted!' })
    } catch (err) {
      res.status(500).json(err);
    }
  },

  async updateUser(req, res) {
    try {
      const updateUser = await User.findByIdAndUpdate(req.params.userId,{
        $set: req.body
      },{
        runValidators: true, new:true,
      });

      if (!updateUser) {
        return res.status(404).json({ message: 'No user with that ID' });
      }

      res.status(200).json(updateUser)
    } catch (err) {
      res.status(500).json(err);
    }
  }, 
 // Add friend 
 async addFriend(req, res) {
  
  try {
    const friend = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );

    if (!friend) {
      return res
        .status(404)
        .json({ message: 'No User found with that ID :(' });
    }

    res.json(friend);
  } catch (err) {
    res.status(500).json(err);
  }
},
// Remove friend
async removeFriend(req, res) {
  try {
    const friend = await User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { runValidators: true, new: true }
    );

    if (!friend) {
      return res
        .status(404)
        .json({ message: 'No friend found with that ID :(' });
    }

    res.json(friend);
  } catch (err) {
    res.status(500).json(err);
  }
},
};

