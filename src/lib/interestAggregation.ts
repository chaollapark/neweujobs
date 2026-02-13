import dbConnect from '@/lib/dbConnect';
import LobbyingEntityModel from '@/models/LobbyingEntity';

export interface InterestCount {
  interest: string;
  count: number;
}

export interface InterestAggregation {
  topInterests: InterestCount[];
  otherInterestsCount: number;
  totalEntitiesWithInterests: number;
}

export async function getTopInterests(): Promise<InterestAggregation> {
  await dbConnect();

  const aggregationResult = await LobbyingEntityModel.aggregate([
    { $match: { interests: { $exists: true, $ne: null, $not: { $size: 0 } } } },
    { $unwind: '$interests' },
    { $match: { $and: [{ interests: { $ne: null } }, { interests: { $ne: '' } }] } },
    {
      $group: {
        _id: '$interests',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    {
      $group: {
        _id: null,
        interests: {
          $push: {
            interest: '$_id',
            count: '$count',
          },
        },
      },
    },
  ]);

  const totalEntitiesWithInterests = await LobbyingEntityModel.countDocuments({
    interests: { $exists: true, $ne: null, $not: { $size: 0 } },
  });

  if (!aggregationResult || aggregationResult.length === 0) {
    return {
      topInterests: [],
      otherInterestsCount: 0,
      totalEntitiesWithInterests,
    };
  }

  const allInterests = aggregationResult[0].interests || [];
  const topInterests = allInterests.slice(0, 10);
  const otherInterests = allInterests.slice(10);
  const otherInterestsCount = otherInterests.reduce((sum: number, item: InterestCount) => sum + item.count, 0);

  return {
    topInterests,
    otherInterestsCount,
    totalEntitiesWithInterests,
  };
}

export async function getAllInterests(): Promise<InterestCount[]> {
  await dbConnect();

  const aggregationResult = await LobbyingEntityModel.aggregate([
    { $match: { interests: { $exists: true, $ne: null, $not: { $size: 0 } } } },
    { $unwind: '$interests' },
    { $match: { $and: [{ interests: { $ne: null } }, { interests: { $ne: '' } }] } },
    {
      $group: {
        _id: '$interests',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    {
      $project: {
        _id: 0,
        interest: '$_id',
        count: 1,
      },
    },
  ]);

  return aggregationResult;
}
