import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  const query = req.query;

  try {
    const posts = await prisma.post.findMany({
      where: {
        city: query.city || undefined,
        type: query.type || undefined,
        property: query.property || undefined,
        bedroom: parseInt(query.bedroom) || undefined,
        price: {
          gte: parseInt(query.minPrice) || undefined,
          lte: parseInt(query.maxPrice) || undefined,
        },
      },
    });

    res.status(200).json(posts); // Send response directly
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: "Failed to get posts" });
  }
};

export const getPost = async (req, res) => {
  const id = req.params.id;

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        postDetail: true,
        user: {
          select: {
            username: true,
            avatar: true,
          },
        },
      },
    });

    const token = req.cookies?.token;

    if (token) {
      try {
        const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const saved = await prisma.savedPost.findUnique({
          where: {
            userId_postId: {
              postId: id,
              userId: payload.id,
            },
          },
        });
        res.status(200).json({ ...post, isSaved: saved ? true : false });
      } catch (err) {
        console.error(err); // Log error for debugging
        // Handle invalid token gracefully (e.g., return 401 Unauthorized)
      }
    } else {
      res.status(200).json({ ...post, isSaved: false });
    }
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: "Failed to get post" });
  }
};

export const addPost = async (req, res) => {
  const body = req.body;
  const tokenUserId = req.userId; // Assuming you have middleware to populate this

  try {
    const newPost = await prisma.post.create({
      data: {
        ...body.postData,
        userId: tokenUserId,
        postDetail: {
          create: body.postDetail,
        },
      },
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: "Failed to create post" });
  }
};

export const updatePost = async (req, res) => {
  // Implement the update logic here, following the same error handling pattern as above

  try {
    // ... update post logic
    res.status(200).json({ message: "Post updated" }); // Or send updated post data
  } catch (err) {
    console.error(err); // Log error for debugging
    res.status(500).json({ message: "Failed to update post" });
  }
};

export const deletePost = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId; // Assuming you have middleware to populate this

  try {
    const post = await prisma.post.findUnique({
      where: { id },
    });

    if (post.userId !== tokenUserId) {
      return res.status(403).json({ message: "Not Authorized!" });
    }

    await prisma.post.delete({
      where: { id },
    });

    res.status(200).json({ message: "Post deleted" });
  } catch (err) {
    console.error(err); // Log error
  }
};

// import prisma from "../lib/prisma.js";
// import jwt from "jsonwebtoken";

// export const getPosts = async (req, res) => {
//   const query = req.query;

//   try {
//     const posts = await prisma.post.findMany({
//       where: {
//         city: query.city || undefined,
//         type: query.type || undefined,
//         property: query.property || undefined,
//         bedroom: parseInt(query.bedroom) || undefined,
//         price: {
//           gte: parseInt(query.minPrice) || undefined,
//           lte: parseInt(query.maxPrice) || undefined,
//         },
//       },
//     });

//     // setTimeout(() => {
//     res.status(200).json(posts);
//     // }, 3000);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get posts" });
//   }
// };

// export const getPost = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const post = await prisma.post.findUnique({
//       where: { id },
//       include: {
//         postDetail: true,
//         user: {
//           select: {
//             username: true,
//             avatar: true,
//           },
//         },
//       },
//     });

//     const token = req.cookies?.token;

//     if (token) {
//       jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
//         if (!err) {
//           const saved = await prisma.savedPost.findUnique({
//             where: {
//               userId_postId: {
//                 postId: id,
//                 userId: payload.id,
//               },
//             },
//           });
//           res.status(200).json({ ...post, isSaved: saved ? true : false });
//         }
//       });
//     }
//     res.status(200).json({ ...post, isSaved: false });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get post" });
//   }
// };

// export const addPost = async (req, res) => {
//   const body = req.body;
//   const tokenUserId = req.userId;

//   try {
//     const newPost = await prisma.post.create({
//       data: {
//         ...body.postData,
//         userId: tokenUserId,
//         postDetail: {
//           create: body.postDetail,
//         },
//       },
//     });
//     res.status(200).json(newPost);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to create post" });
//   }
// };

// export const updatePost = async (req, res) => {
//   try {
//     res.status(200).json();
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to update posts" });
//   }
// };

// export const deletePost = async (req, res) => {
//   const id = req.params.id;
//   const tokenUserId = req.userId;

//   try {
//     const post = await prisma.post.findUnique({
//       where: { id },
//     });

//     if (post.userId !== tokenUserId) {
//       return res.status(403).json({ message: "Not Authorized!" });
//     }

//     await prisma.post.delete({
//       where: { id },
//     });

//     res.status(200).json({ message: "Post deleted" });
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to delete post" });
//   }
// };

// import prisma from "../lib/prisma.js";

// export const getPosts = async (req,res) => {
//     const query = req.query;
//    // console.log(query);
//     try {
//         const posts = await prisma.post.findMany({
//           where:{
//             city: query.city || undefined,
//              type: query.type || undefined,
//              property: query.property || undefined,
//              bedroom: parseInt(query.bedroom) || undefined,
//              price:{
//                 gte: parseInt(query.minPrice) || 0,
//                 lte: parseInt(query.maxPrice) || 10000000,
//              }
//           }
//     });         
        
//         // setTimeout(() => {        
//             res.status(200).json(posts);
//         // }, 3000);  //in localhost:5173/list -> it takes seconds showing loading then finally it loads our list page
//     } 
//     catch (err) {
//         console.log(err);
//         res.status(500).json({message: "Failed to get Posts"});
//     }
// }

// export const getPost = async (req,res) => {
//     const id = req.params.id;
//     try {
        
//         const post = await prisma.post.findUnique({
//             where:{id},
//             include:{
//                 postDetail:true,
//                 user: {
//                     select:{
//                         username: true,
//                         avatar: true
//                     }
//                 }
//             },
//         });         
        
//         res.status(200).json(post);

//     } catch (err) {
//         console.log(err);
//         res.status(500).json({message: "Failed to get Post"});
//     }
// }

// export const addPost = async (req,res) => {
    
//     const body = req.body;
//     const tokenUserId = req.userId;
//     try {
//        const newPost = await prisma.post.create({
//         data:{
//             ...body.postData,
//             userId: tokenUserId,
//             postDetail:{
//                create:body.postDetail,
//             },
//         },
//        });
//        res.status(200).json(newPost);    
//     } 
//     catch (err) {
//         console.log(err);
//         res.status(500).json({message: "Failed to create Post"});
//     }
// }

// export const updatePost = async (req,res) => {
//     try {
        
//     } catch (err) {
//         console.log(err);
//         res.status(500).json({message: "Failed to update Posts"});
//     }
// }

// export const deletePost = async (req,res) => {
//     const id = req.params.id;
//     const tokenUserId = req.userId;

//     try {
//        const post = await prisma.post.findUnique({
//         where:{id}
//        })      

//        if(post.userId !== tokenUserId){
//         return res.status(403).json({message: "Not Authorized!"});
//        }

//        await prisma.post.delete({
//         where: {id},
//        });

//        res.status(200).json({message: "Post Deleted!"});
//     } 
//     catch (err) {
//         console.log(err);
//         res.status(500).json({message: "Failed to delete Post"});
//     }
// }