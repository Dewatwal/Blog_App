import jwt from 'jsonwebtoken'; 

export const adminLogin = (req, res) => {
  try {
    const { email, password } = req.body;
    if (email !== process.env.ADMIN_EMAIL || password !== process.env.ADMIN_PASSWORD) {
      return res.json({succes:false, message: "Invalid Credentials" });
    } 
    const token  = jwt.sign({ email }, process.env.JWT_SECRET);
    res.json({succes:true, token });
  } catch (error) {   
    console.error("Error during admin login:", error);
     res.json({success:false, message: "Server error during admin login" });  
  }
};  
