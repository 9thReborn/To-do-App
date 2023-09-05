import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { User } from "../model/userModel";
import { registerUserSchema, loginUserSchema, options } from "../utils/utils";
import bcrypt from "bcryptjs";
import Jwt from "jsonwebtoken";
import { ToDo } from "../model/toDoModel";

const jwt_secret = process.env.JWT_TOKEN as string;
const salt = Number(process.env.SALT);

// /**************** Register ******************/

// export const Register = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   try {
//     const idGenerator = uuidv4();
//     const { email, firstName, password, confirm_password } = req.body;

//     const validationResult = await registerUserSchema.validate(
//       req.body,
//       options
//     );

//     if (validationResult.error) {
//       return res.status(400).json({
//         Error: validationResult.error.details[0].message
//       });
//     }

//     /** check if user exists */
//     const user = await User.findOne({
//       where: { email }
//     });

//     const passwordhash = await bcrypt.hash(password, salt);

//     if (!user) {
//       const newUser = await User.create({
//         id: idGenerator,
//         email,
//         firstName,
//         password: passwordhash,
//       });

//       const source = await User.findOne({
//         where: { email: email }
//       }) as unknown as { [key: string]: string };

//       const { id } = source;

//       const token = Jwt.sign({ id }, jwt_secret, { expiresIn: "30mins" });
//       // res.cookie("token", token, {httpOnly: true, maxAge: 30 * 60 * 1000});

//       return res.status(201).json({
//         msg: "User created",
//         newUser,
//         token,
//       });
//     } else {
//       return res.status(400).json({
//         Error: "User already exists",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

// /**************** Login ******************/

// export const Login = async(req:Request, res:Response) => {
//   try {
//     const { email, password } = req.body;

//     const validationResult = loginUserSchema.validate(req.body, options);

//     if (validationResult.error) {
//       return res.status(400).json({
//         Error: validationResult.error.details[0].message
//       })
//     }

//     const user = await User.findOne({
//       where:{email:email}
//     }) as unknown as { [key: string]: string }
    
//     const { id } = user
//     const token = Jwt.sign({ id }, jwt_secret, { expiresIn: "30mins" })
//     // res.cookie("token", token, {httpOnly: true, maxAge: 30 * 60 * 1000})
//     const validUser = await bcrypt.compare(password, user.password)

//     if (validUser) {
//       return res.status(200).json({
//         "msg": "User successfully logged in",
//         user,
//         token
//       })
//     }
//     return res.status(401).json({
//       Error: "Invalid username or password"
//     })
    
//   } catch (error) {
//     console.log(error);
//     res.status(500).json({
//       Error: "Internal Server Error"
//     })
//   }
// }


// /**************** Get All Users And Todos ******************/
// export const getAllUsersAndTodos = async(req: Request, res: Response) => {
//   try {
//     const data = await User.findAll({
//       include: [
//         {
//           model: ToDo,
//           as: "todo"
//         }
//       ]
//     })
//     return res.status(200).json({
//       data,
//       msg: "Successfully retrieved all users"
//     })
    
//   } catch (error) {
//     console.log(error);
//   }
// }
/**================= EJS API ================================ */
/**************** Register ******************/

export const Register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const idGenerator = uuidv4();
    const { email, firstName, password, confirm_password } = req.body;

    const validationResult = await registerUserSchema.validate(
      req.body,
      options
    );

    if (validationResult.error) {
      return res.render("register", { error: validationResult.error.details[0].message})
    }

    /** check if user exists */
    const user = await User.findOne({
      where: { email }
    });

    const passwordhash = await bcrypt.hash(password, salt);

    if (!user) {
      const newUser = await User.create({
        id: idGenerator,
        email,
        firstName,
        password: passwordhash,
      });

      const source = await User.findOne({
        where: { email: email }
      }) as unknown as { [key: string]: string };

      const { id } = source;

      // om registration we don't need to assign a token to the user
      
      // const token = Jwt.sign({ id }, jwt_secret, { expiresIn: "30mins" });
      // res.cookie("token", token, {httpOnly: true, maxAge: 30 * 60 * 1000});

      return res.redirect("/login");
    } else {
      return res.render("register", {error: "User already registered, kindly log in"})
    }
  } catch (error) {
    console.log(error);
  }
};

/**************** Login ******************/

export const Login = async(req:Request, res:Response) => {
  try {
    const { email, password } = req.body;

    const validationResult = loginUserSchema.validate(req.body, options);

    if (validationResult.error) {
            return res.render("login", {
              error: validationResult.error.details[0].message,
            });
    }

    const user = await User.findOne({
      where:{email:email}
    }) as unknown as { [key: string]: string }

      if (!user) {
        res.render("login", { error: "Invalid Email" });
      }
    
    const { id } = user

    const token = Jwt.sign({ id }, jwt_secret, { expiresIn: "30mins" })
    res.cookie("token", token, { httpOnly: true, maxAge: 30 * 60 * 1000 })
    
    const validUser = await bcrypt.compare(password, user.password)

    if (validUser) {
      return res.redirect('/dashboard')
    } 
        res.render("login", { error: "Invalid password" });
    
   
    
  } catch (error) {
    console.log(error);
    // res.status(500).json({
    //   Error: "Internal Server Error"
    // })
  }
}


/**************** Get All Users And Todos ******************/
export const getAllUsersAndTodos = async(req: Request, res: Response) => {
  try {
    const data = await User.findAll({
      include: [
        {
          model: ToDo,
          as: "todo"
        }
      ]
    })
    return res.status(200).json({
      data,
      msg: "Successfully retrieved all users"
    })
    
  } catch (error) {
    console.log(error);
  }
}

/**============ Logout =================*/
export const Logout = async (req: Request, res: Response) => {
  res.clearCookie("token")
  return res.redirect('/login')
}