class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        vector<int>res;
        int temp=0;
        for(int i=0;i<nums.size();i++){
            int sum=nums[i];
            for(int j=0;j<nums.size();j++){
                sum+=nums[j];
                if(sum==target && i!=j){
                    res.push_back(i);
                    res.push_back(j);
                    temp=1;
                    break;
                }
                sum-=nums[j];
            }
            if(temp==1)
                    break;
        }
        return res;
    }
};