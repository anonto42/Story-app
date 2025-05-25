import { JwtPayload } from "jsonwebtoken"
import { User } from "../user/user.model"
import { Subscription as typeOfSub } from "./input.types"
import { Post } from "../post/post.model"
import ApiError from "../../../errors/ApiError"
import { StatusCodes } from "http-status-codes"
import { Request } from "express"
import unlinkFile from "../../../shared/unlinkFile"
import { Subscription } from "../subscription/subscription.model"
import { USER_STSTUS } from "../../../enums/user"
import { SUBSCRIPTION_TYPE } from "../../../enums/subscription"


const OverView = async (
    payload: JwtPayload
) => {
    const admin = await User.isUserExist({_id: payload.userID})
    
    const totalUsers = await User.countDocuments();
    
    const activeUsersCount = await User.countDocuments({
        lastActive: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    const getTotalRevenue = async () => {
        const totalRevenue = await Subscription.aggregate([
            {
            $match: {
                type: SUBSCRIPTION_TYPE.SUBSCRIBED,
            }
            },
            {
            $lookup: {
                from: 'subscriptions',
                localField: 'subscriptionPlanId',
                foreignField: '_id',
                as: 'planDetails'
            }
            },
            {
            $unwind: "$planDetails"
            },
            {
            $group: {
                _id: null,
                totalRevenue: { $sum: "$planDetails.packagePrice" }
            }
            }
        ]);

        // If the aggregation has no results, set totalRevenue to 0
        return totalRevenue.length > 0 ? totalRevenue[0].totalRevenue : 0;
    };
    const totalRevenue = await getTotalRevenue();


    // const totalRevenue = totalRevenueAgg[0]?.total || 0;
    
    const plans = await Subscription.find({type: SUBSCRIPTION_TYPE.SUBSCRIPTION_PLAN});

    const totalSubscriptions = await Subscription.countDocuments();
    
    
    const monthlySalesByYear = await Subscription.aggregate([
            {
                $match: {
                    type: SUBSCRIPTION_TYPE.SUBSCRIBED,
                // status: SUBSCRIPTION_STATUS.ACTIVE, // Optional: only count active subscriptions
                }
            },
            {
                $lookup: {
                    from: 'subscriptions', // Collection with plan details
                    localField: 'subscriptionPlanId',
                    foreignField: '_id',
                    as: 'planDetails'
                }
            },
            {
                $unwind: "$planDetails"
            },
            {
                $addFields: {
                    year: { $year: "$createdAt" },  // or "$date" if you use custom date
                    month: { $month: "$createdAt" }
                }
            },
            {
                $group: {
                    _id: {
                        year: "$year",
                        month: "$month"
                    },
                    totalSales: { $sum: "$planDetails.packagePrice" }
                }
            },
            {
                $group: {
                _id: "$_id.year",
                    monthlySales: {
                        $push: {
                        month: "$_id.month",
                        totalSales: "$totalSales"
                        }
                    }
                }
            },
            {
                $project: {
                    _id: 0,
                    year: "$_id",
                    monthlySales: {
                        $map: {
                        input: "$monthlySales",
                        as: "item",
                        in: {
                            month: {
                            $arrayElemAt: [
                                [
                                "", "January", "February", "March", "April",
                                "May", "June", "July", "August",
                                "September", "October", "November", "December"
                                ],
                                "$$item.month"
                            ]
                            },
                            totalSales: "$$item.totalSales"
                        }
                        }
                    }
                }
            },
            {
                $sort: { year: 1 }
            }
    ]);

    const startOfWeek = new Date();
    startOfWeek.setHours(0, 0, 0, 0);
    // Set to Sunday (start of week in JS default)
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    const weeklySubscriptions = await Subscription.aggregate([
    {
        $match: {
        type: SUBSCRIPTION_TYPE.SUBSCRIBED,
        //   status: SUBSCRIPTION_STATUS.ACTIVE,
        createdAt: { $gte: startOfWeek, $lte: endOfWeek }
        }
    },
    {
        $addFields: {
        dayOfWeek: { $dayOfWeek: "$createdAt" } // Sunday=1 ... Saturday=7
        }
    },
    {
        $group: {
        _id: "$dayOfWeek",
        count: { $sum: 1 }
        }
    },
    {
        $project: {
        _id: 0,
        dayOfWeek: "$_id",
        count: 1
        }
    },
    {
        $sort: { dayOfWeek: 1 }
    }
    ]);

    // To map day number to name:
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    const result = dayNames.map((name, index) => {
    const dayData = weeklySubscriptions.find(w => w.dayOfWeek === index + 1);
    return {
        day: name,
        count: dayData ? dayData.count : 0
    };
    });

    const engagementRate = totalUsers > 0
        ? Math.round((activeUsersCount / totalUsers) * 100)
        : 0;

    return {
    totalUsers,
    activeUsersCount,
    totalRevenue,
    totalSubscriptions: totalSubscriptions - plans.length ,
    monthlySalesByYear,      
    weeklySubscription: result,  
    engagementRate  
  };
}

const doAPost = async (
    req: Request, 
    user: any,
    {
        coverPhotoPath,
        mainFilePath
    }:any
) => {
  const {
    type,
    category,
    title,
    singerName,
    targetedAge,
    duration,
    description,
    language
  } = req.body;

    await User.isUserExist({_id: req.user.userID})
 
  // Validate required files
  if (!coverPhotoPath || !mainFilePath ) {
    throw new Error('All required files (coverPhoto, media) must be uploaded.');
  }

  // Create the Post
  const post = await Post.create({
    type: type.toString(),
    category,
    title,
    singerName,
    targetedAge,
    duration,
    description,
    coverPhoto: coverPhotoPath,
    mainFile: mainFilePath,
    language: language,
    createdBy: user._id,
  });

  return post;
};

const deleteApost = async (
    payload: JwtPayload,
    postId: string
) => {
    await User.isUserExist({_id: payload.userID});
    if (!postId) {
        throw new ApiError(StatusCodes.BAD_REQUEST,"You must give the post id to delete the post")
    };
    const postDelete = await Post.findByIdAndDelete(postId);
    if (!postDelete) {
        throw new ApiError(StatusCodes.NOT_FOUND,"Post dosn't exist!")
    };

    unlinkFile(postDelete.mainFile!);    
    unlinkFile(postDelete.coverPhoto!);

    return true;
}

const getAllSubscriptions = async ( payload: JwtPayload) => {
    await User.isUserExist({_id: payload.userID})
    return await Subscription.find({type: SUBSCRIPTION_TYPE.SUBSCRIBED})
        .populate('userID',"-password -otpVerification -__v")
        .sort({ createdAt: -1 })
        .lean();
};

const ASubscription = async ( payload: JwtPayload, id: string ) => {
    await User.isUserExist({_id: payload.userID });
    console.log(id)

      const subscription = await Subscription.findById(id)
        .populate('userID',"-password")
        .populate('subscriptionPlanId')
        .lean();

    return subscription
}

const getAllPlans = async ( payload: JwtPayload) => {
    await User.isUserExist({_id: payload.userID})
    return await Subscription.find({type: SUBSCRIPTION_TYPE.SUBSCRIPTION_PLAN})
        .populate('userID', 'name')
        .sort({ createdAt: -1 })
        .lean();
};

const createSubscription = async (
    payload: JwtPayload,
    data: typeOfSub
) => {
    await User.isUserExist({_id: payload.userID});

    const subscription = await Subscription.create({
        type: SUBSCRIPTION_TYPE.SUBSCRIPTION_PLAN,
        packageName: data.packageName,
        packagePrice: data.packagePrice,
        description: data.description,
        subscriptionDuration: data.subscriptionDuration
    })

    return subscription
}

const updateSubscription = async (
    payload: JwtPayload,
    data: typeOfSub
) => {
    await User.isUserExist({_id: payload.userID});

    const subscription = await Subscription.findByIdAndUpdate(data.id, {
        packageName: data.packageName,
        packagePrice: data.packagePrice,
        subscriptionDuration: data.subscriptionDuration,
        description: data.description
    },{ new: true });

    return subscription

}

const allUsers = async (paylaod: JwtPayload) => {
    await User.isUserExist({_id: paylaod.userID })

    return User.find().select("-password -otpVerification -__v")
}

const AUser = async (paylaod: JwtPayload, id: string) => {
    await User.isUserExist({_id: paylaod.userID})
    return User.findById(id).select("-password -otpVerification")
}

const deleteUser = async (payload: JwtPayload, id: string) => {
    await User.isUserExist({_id: payload.userID})

    const user = await User.findByIdAndDelete(id).select("-password");
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND,"User not founded!")
    }
    return user
}

const blockUser = async (payload: JwtPayload, id: string) => {
    await User.isUserExist({_id: payload.userID})

    const user = await User.findOneAndUpdate({_id: id},{ status: USER_STSTUS.BLOCK }).select("-password");
    if (!user) {
        throw new ApiError(StatusCodes.NOT_FOUND,"User not founded!")
    }
    return user
}

const updatePrivacy = async (
    payload: JwtPayload,
    text: string
) => {
    const privacy = await User.isUserExist({ _id: payload.userID });

    if (!privacy) {
        throw new ApiError(StatusCodes.NOT_FOUND,"Admin model not founded for update!");
    }

    privacy.privacyPolicy = text;
    await privacy.save();

    return true;
}

const updateCondition = async (
    payload: JwtPayload,
    text: string
) => {
    const condition = await User.isUserExist({ _id: payload.userID });

    if (!condition) {
        throw new ApiError(StatusCodes.NOT_FOUND,"Admin model not founded for update!");
    }

    condition.termsConditions = text;
    await condition.save();

    return true;
}


export const AdminService = {
    OverView,
    doAPost,
    deleteApost,
    getAllSubscriptions,
    ASubscription,
    createSubscription,
    updateSubscription,
    allUsers,
    AUser,
    deleteUser,
    blockUser,
    updatePrivacy,
    updateCondition,
    getAllPlans
}