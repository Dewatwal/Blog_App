import jwt from 'jsonwebtoken'; 
import Blog from '../models/Blog.js';
import Comment from '../models/Comment.js';

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

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({createdAt:-1}); 
    res.json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching all blogs for admin:", error);
    res.json({ success: false, message: "Server error while fetching blogs" });
  }
}

export const getAllComments = async (req, res) => {
  try {
   const comments = await Comment.find({}).populate('blog').sort({createdAt:-1});
    res.json({ success: true, comments });  
  } catch (error) {
    console.error("Error fetching comments for blog:", error);
    res.json({ success: false, message: "Server error while fetching comments" });
  }
}

export const getDashboard = async (req, res) => {
  try{
    const recentBlogs = await Blog.find({}).sort({createdAt:-1}).limit(5);
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({isPublished:false});
    const dashboardData = {
      recentBlogs,
      blogs,
      comments,
      drafts
    };
    res.json({success:true,dashboardData});

  }
  catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.json({ success: false, message: "Server error while fetching dashboard data" });
  }
}


export const deleteCommentById = async (req, res) => {
  try{
     const {id} = req.body;
      await Comment.findByIdAndDelete(id);
      res.json({success:true, message:"Comment deleted successfully"});
  }
  catch (error) {
    console.error("Error deleting comment by ID:", error);
    res.json({ success: false, message: "Server error while deleting comment" });
  }
}


export const approveCommentById = async (req, res) => {
  try{
     const {id} = req.body;
     const comment = await Comment.findByIdAndUpdate(id);
     if(!comment){
      return res.json({success:false, message:"Comment not found"});
     }
      comment.isApproved = true;
      await comment.save();
      res.json({success:true, message:"Comment approved successfully"});  
  }
  catch (error) {
    console.error("Error approving comment by ID:", error);
    res.json({ success: false, message: "Server error while approving comment" });
  }
}