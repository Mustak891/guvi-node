import User from "./userSchema.js";
import express from 'express';
import bcrypt from 'bcrypt';
import auth from "./auth.js";

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const username = req.body.username;
        const email = req.body.email;
        const password = req.body.password;

        if (!username || !email || !password) {
            return res.status(400).send("Please enter all fields");
        }

        const isuserexists = await User.findOne({ username: username });
        const isemailexists = await User.findOne({ email: email });

        if (isuserexists || isemailexists) {
            return res.status(400).send("User already exists please login");
        }

        const createdUser = new User({
            username: username,
            email: email,
            password: password,
        });

        await createdUser.save();

        res.status(201).send("User created successfully");

    } catch (err) {
        console.log(err);
    }
});

//login user 
router.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;

        //find if user exists
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).send("User does not exist");
        }

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                //generate auth token if user is found
                const token = await user.generateAuthToken();
                res.cookie("token", token, {
                    expires: new Date(Date.now() + 8600000),
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                });
                
                // console.log(token)
                res.status(200).send("User logged in successfully");
            } else {
                res.status(400).send("Invalid credentials");
            }
        } else {
            res.status(400).send("Invalid credentials");
        }
    } catch (err) {
        res.status(400).send(err);
    }
})

//user logout
router.get('/logout', async (req, res) => {
    res.clearCookie('token', { path: '/', httpOnly: true, secure: true, sameSite: "none" });
    res.status(200).send("User logged out successfully");
})


//Authenticate user
router.get('/auth', auth, async (req, res) => {

})


router.get('/user/:email', async (req, res) => {
    try {

        const email = req.params.email

        const user = await User.aggregate(
            [{
                $match: {
                    email: email
                }
            }]
        );
        res.status(200).send(user);
    }
    catch (err) {
        console.log(err);
    }
})


//update 
router.put('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndUpdate(id);
        user.username = req.body.username;
        user.email = req.body.email;
        user.age = req.body.age;
        user.mobile = req.body.mobile;
        user.gender = req.body.gender;
        user.dob = req.body.dob;

        await user.save();
        res.status(200).send("user updated successfully");
    }
    catch (err) {
        console.log(err);
    }
}
)


export const usersRouter = router;
