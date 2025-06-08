const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


//registyer
exports.register = async (req, res) => {

  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists. Please login.' });
    }

    // Create new user and hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    user = new User({
      username,
      email,
      password: hashedPassword,
    });

    // Save the new user to the database
    await user.save();

    // (Optional) Generate a token for the user
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(201).json({ msg: 'User registered successfully', token });

  }
  catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
}



exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Find the user by email
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'User does not exist. Please register.' });
    }

    // Check the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials. Please try again.' });
    }

    // (Optional) Create a token for the user
    const token = jwt.sign({ userId: user._id ,username: user.username,role: user.role}, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.status(200).json({ msg: 'Login successful', token,role: user.role });
  }
  catch (err) {
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
};


exports.isAdmin= async (req, res) => {

  const { username, email, password } = req.body;

    try {
        // Check if an admin with the given email already exists
        let admin = await User.findOne({ username });
        if (admin) return res.status(400).json({ msg: "Admin already exists" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new admin user
        admin = new User({
            username,
            email,
            password: hashedPassword,
            role: "admin", // Explicitly setting role as "admin"
        });

        await admin.save();
        res.status(201).json({ msg: "Admin created successfully" });

    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};


exports.getUserCount=async(req,res)=>{
  
  try {
    const count = await User.countDocuments(); // Get the number of users
    res.status(200).json({ count });
  } catch (error) {
    // console.error("Error fetching user count:", error);
    res.status(500).json({ message: "Server error" });
  }
}


