export const minutesPerToken = 1;
export const maximumChallenge = 10;

export const getTaskReward = function (task) {
    return Math.round((task.time / minutesPerToken) * (task.challenge / maximumChallenge));
}

export const getTaskRewardTotal = function (task) {
    return Math.round(((task.time * task.goalCompletions) / minutesPerToken) * (task.challenge / maximumChallenge));
}

export const getUserRewardTotal = function (tasks) {
    return tasks.reduce((count, task) =>
        count += getTaskRewardTotal(task)
        , 0
    );
}

export const getPrizeCost = function (prize, userRewardTotal, userBudget) {
    return (prize.costDollars / userBudget) * userRewardTotal;
}