import fs from "fs";
import imagekit from "../configs/imageKit.js";
import Blog from "../models/Blog.js";
export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const imageFile = req.file;

    if (!title || !description || !category || !imageFile) {
      return res.json({ success: false, message: "All fields are required" });
    }

    const fileBuffer = fs.readFileSync(imageFile.path);
    // uploading image to imagekit
    const response = await imagekit.upload({
      file: fileBuffer, //required
      fileName: imageFile.originalname, //required
      folder: "/blogs",
    });
    // optimize through imagekit url transformation
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        {
          quality: "auto",
        },
        {
          format: "webp", 
        }
        ,
        {
          height: "300",
          width: "800",
        },
      ],
    });
    
    const image = optimizedImageUrl;
     await  Blog.create({
        title,  
        subTitle,
        description,
        category,
        image,
        isPublished
      });
      res.json({success:true, message:"Blog added successfully" })
  } catch (error) {
    console.error("Error adding blog:", error);
    res.json({ success: false, message: "Server error while adding blog" });    
  }
};


export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({isPublished:true})
    res.json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.json({ success: false, message: "Server error while fetching blogs" });
  }
}

export const getBlogById = async (req, res) => {
  try {
    const {blogId} = req.params;
    const blog = await Blog.findById(blogId);
    if(!blog){
      return res.json({success:false, message:"Blog not found"});
    }
    res.json({success:true, blog});
  }
  catch (error) {
    console.error("Error fetching blog by ID:", error);
    res.json({ success: false, message: "Server error while fetching blog" });
  }
}

export const deleteBlogById = async (req, res) => {
  try{
    const {id} = req.body;
    await Blog.findByIdAndDelete(id);
    res.json({success:true, message:"Blog deleted successfully"});
  }
  catch (error) {
    console.error("Error deleting blog by ID:", error);
    res.json({ success: false, message: "Server error while deleting blog" });
  } 
}