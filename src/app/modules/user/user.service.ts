import { StatusCodes } from 'http-status-codes';
import { JwtPayload } from 'jsonwebtoken';
import { ACCOUNT_TYPE, USER_ROLES, USER_STSTUS } from '../../../enums/user';
import ApiError from '../../../errors/ApiError';
import unlinkFile from '../../../shared/unlinkFile';
import { IUser } from './user.interface';
import { User } from './user.model'; 
import { jwtHelper } from '../../../helpers/jwtHelper';
import { eduEmailRegex } from '../../../regex/user';
import { checkout, customers } from './user.route';
import config from '../../../config';
import { Subscription } from '../subscription/subscription.model';
import { SUBSCRIPTION_DURATION_TIME, SUBSCRIPTION_TYPE } from '../../../enums/subscription';
import { Post } from '../post/post.model';
import { Types } from 'mongoose';

const createUserToDB = async (payload: Partial<IUser> ) => {
  let isEdu = false;

  if (payload.requestedAccountType === ACCOUNT_TYPE.STUDENT) {
    isEdu = eduEmailRegex.test(payload.email as string)
    if (!isEdu) {
      throw new ApiError(StatusCodes.BAD_REQUEST,"Your email account is not a educational email account so you can't create the student account")
    }
  }

  const userData = {
    name: payload.name,
    role: USER_ROLES.USER,
    contact: payload.contact,
    email: payload.email,
    password: payload.password,
    location: payload.location, 
    status: USER_STSTUS.ACTIVE,
    accountType: isEdu? ACCOUNT_TYPE.STUDENT : ACCOUNT_TYPE.REGULAR
  }
  
  const createUser = await User.create(userData);
  if (!createUser) { 
    throw new ApiError(StatusCodes.BAD_REQUEST, 'Failed to create user');
  }

  const Token = jwtHelper.createToken({userID: createUser._id.toString(),role: USER_ROLES.USER})

  return {user:{
    name: createUser.name,
    email: createUser.email,
    contact: createUser.contact,
    profile: createUser.profile,
    location: createUser.location
  },Token}
};

const getUserProfileFromDB = async (
  user: JwtPayload
): Promise<Partial<IUser>> => {
  const { userID } = user;
  const isExistUser = await User.findById(userID).select("-password -accountType -createdAt -updatedAt -lastActive -otpVerification -freeVideo -subscription -__v");
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  return isExistUser;
};

const updateProfileToDB = async (
  user: JwtPayload,
  payload: Partial<IUser>
): Promise<Partial<IUser | null>> => {
  const { userID } = user;
  const isExistUser = await User.findById(userID);
  if (!isExistUser) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User doesn't exist!");
  }

  //unlink file here
  if (payload.profile) {
    unlinkFile(isExistUser.profile!);
  }

  const updateDoc = await User.findOneAndUpdate({ _id: userID }, payload, {
    new: true,
  });

  return updateDoc;
};

const getCondition = async (
    payload: JwtPayload
) => {
  await User.isUserExist({ _id: payload.userID });
  const condition = await User.findOne({ role: USER_ROLES.ADMIN });
  if (!condition) {
    throw new ApiError(StatusCodes.NOT_FOUND,"Condition and condition was not founded!");
  }
  return condition.termsConditions || "";
}

const getPolicy = async (
    payload: JwtPayload
) => {
  await User.isUserExist({ _id: payload.userID });
  const condition = await User.findOne({ role: USER_ROLES.ADMIN });
  if (!condition) {
    throw new ApiError(StatusCodes.NOT_FOUND,"Privacy and policy was not founded!");
  }
  return condition.privacyPolicy || "";
}

const addToPlaylist = async (
  payload: JwtPayload,
  post_id: string
) => {
  const user = await User.isUserExist({_id: payload.userID });
  
  const objectId = new Types.ObjectId(post_id);

  const isExist = user.playList.some( e => e.equals(objectId));
  if (!isExist) {
    user.playList.push(objectId)
    await user.save()
  };

  const userData = await User.findById(payload.userID).populate('playList');

  return userData?.playList
  
}

const getPlaylist = async (
  payload: JwtPayload
) => {
  const playlist = (await User.isUserExist({_id: payload.userID })).populate("playList");
  
  return (await playlist).playList
}

const filterData = async (
  payload: JwtPayload,
  query: {
    storyOrMusic: "STORY" | "MUSIC", 
    category: string,
    duration: string,
    age: string,
    language: string
  }
) => {
  const user = User.isUserExist({_id: payload.userID}); 
  // Build filter object
  const filter: any = {};

  if (query.storyOrMusic) {
    filter.type = query.storyOrMusic;
  }

  if (query.category) {
    filter.category = query.category;
  }

  if (query.duration) {
    filter.duration = query.duration;
  }

  if (query.age) {
    const ageNumber = parseInt(query.age);
    if (!isNaN(ageNumber)) {
      filter.targetedAge = { $lte: ageNumber };
    }
  }

  if (query.language) {
    filter.language = query.language;
  }

  // Find posts using the dynamic filter
  const results = await Post.find(filter).sort({ createdAt: -1 }); // optional: sorted by newest

  return results;

}

const dataForHome = async (
  payload: JwtPayload,
  {
    type,
    limit = 5 // this was the defualt value
  }:{
    type: "children" | "featured" | "popular",
    limit: number
  }
) => {
  const user = await User.isUserExist({_id: payload.userID });

  if (type === "popular") {
    const popularPosts = await Post.aggregate([
      {
        $addFields: {
          viewCount: { $size: "$views" } // Add a temporary field "viewCount"
        }
      },
      {
        $sort: { viewCount: -1 } // Sort by viewCount in descending order
      },
      {
        $limit: limit // Limit results (default: 10)
      },
      {
        $project: {
          views: 0 // Optionally exclude views array
        }
      }
    ])
    return popularPosts
  }

  if ( type === 'children') {
    const childrenContants = await Post.find({targetedAge: { $lt: 18 }})
                                        .limit(limit);
    return childrenContants
  }

  if (type === "featured") {
    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(limit);
    return recentPosts;
  }

}

const aPostData = async (
  payload: JwtPayload,
  postID: string
) => {
  const user = await User.isUserExist({_id: payload.userID}); 
  const post = await Post.findById(postID).select("-__v");
  if (!post) {
    throw new ApiError(StatusCodes.NOT_FOUND,"Post not founded!")
  }
  const isAllreadyViewed = post.views.filter( e => e === user._id );
  if (!isAllreadyViewed) {
    post.views.push(user._id);
    post.save();
  }
  return post
}

const subscribe = async (
  paylaod: JwtPayload,
  data: {
    planID: string,
    protocol: string,
    host: string
  }
) => {
  const user = await User.isUserExist({_id: paylaod.userID });
  const packageData = await Subscription.findById(data.planID);
  if (!packageData) {
    throw new ApiError(StatusCodes.NOT_FOUND,"We can't find your package!")
  };
  if (!user.subscription.stripeCustomerID) {
    const customer = await customers.create({
      email: user.email,
      name: user.name
    });
    if (!customer) {
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR,"Failed to create the customer on the stripe!")
    };
    user.subscription.stripeCustomerID = customer.id;
    await user.save();
  };

  const session = await checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: packageData.packageName,
            description: `This is the id of the plan your buying ${data.planID}`
          },
          unit_amount: packageData.packagePrice * 100,
        },
        quantity: 1
      }
    ],
    metadata: {
      name: user.name,
      email: user.email,
      amount: packageData.packagePrice,
      userID: user._id.toString(), 
      plan_id: data.planID,
      plan_name: packageData.packageName
    },
    customer: user.subscription.stripeCustomerID.toString(),
    success_url: `${data.protocol}://${data.host}/api/v1/user/subscribe-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${data.protocol}://${data.host}/api/v1/user/subscribe-failed?session_id={CHECKOUT_SESSION_ID}`
  })

  return session.url
}

const subscribeSuccessfull = async (
  seccionID: string
) => {
  const { metadata } = await checkout.sessions.retrieve(seccionID);
  const user = await User.isUserExist({_id: metadata?.userID });
  const subscriptionPlan = await Subscription.findById(metadata?.plan_id);

  if (user.subscription.expireAT < new Date( Date.now() )) {
    if (subscriptionPlan?.subscriptionDuration === SUBSCRIPTION_DURATION_TIME.MONTHLY ) {
      user.subscription.expireAT = new Date( Date.now() + 30 * 24 * 60 * 60 * 1000 );
      user.subscription.isSubscriped = true;
      user.subscription.limite = 10;
    } else if (subscriptionPlan?.subscriptionDuration === SUBSCRIPTION_DURATION_TIME.YEARLY) {
      user.subscription.expireAT = new Date( Date.now() + 365 * 24 * 60 * 60 * 1000 );
      user.subscription.isSubscriped = true;
      user.subscription.limite = 15;
    }
  }

  if (user.subscription.expireAT >= new Date()) {
    if (subscriptionPlan?.subscriptionDuration === SUBSCRIPTION_DURATION_TIME.MONTHLY) {
      user.subscription.expireAT = new Date(
        user.subscription.expireAT.getTime() + 30 * 24 * 60 * 60 * 1000
      );
      user.subscription.isSubscriped = true;
      user.subscription.limite = 10
    } else if (subscriptionPlan?.subscriptionDuration === SUBSCRIPTION_DURATION_TIME.YEARLY) {
      user.subscription.expireAT = new Date(
        user.subscription.expireAT.getTime() + 365 * 24 * 60 * 60 * 1000
      );
      user.subscription.isSubscriped = true;
      user.subscription.limite = 15
    }
  };

  user.subscription.subscriptionID = subscriptionPlan?._id as string

  await Subscription.create({
    type: SUBSCRIPTION_TYPE.SUBSCRIBED,
    userID: user._id,
    subscriptionPlanId: subscriptionPlan?._id
  })
  await user.save();

  return true
}

const subscribeFiled = async (
  paylaod: JwtPayload,
  planID: string
) => {

  return true
}


export const UserService = {
  createUserToDB,
  getUserProfileFromDB,
  updateProfileToDB,
  getPolicy,
  getCondition,
  filterData,
  subscribe,
  subscribeFiled,
  subscribeSuccessfull,
  aPostData,
  dataForHome,
  addToPlaylist,
  getPlaylist
};
