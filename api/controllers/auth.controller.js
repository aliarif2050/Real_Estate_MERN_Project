import User from "../models/user.model.js";
import jwt from 'jsonwebtoken'
import bcryptjs from 'bcryptjs'
import { errorHandler } from "../utils/error.js";
export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    const hashedPassword =  bcryptjs.hashSync(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save()
        .then(() => {
            res.status(201).json({ message: 'User created successfully', user: newUser });
        })
        .catch(err => {
         next(err);
        });
        // helllob g
}
export const signin = async (req, res, next) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return next(errorHandler(404,'User not found' ));
        }
        const isMatch = bcryptjs.compareSync(password, user.password);
        if (!isMatch) {
            return next(errorHandler(401,'Invalid password' ));
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
        const {password : pass, ...rest} = user._doc
        res.cookie('token', token, { httpOnly: true, expires: new Date(Date.now() + 3600000) })
        .status(200)
        .json({ message: 'Signin successful', rest, token });
    } catch (error) {
        next(error);
    }
}