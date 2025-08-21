class Solution {
public:
    int repeatedNTimes(vector<int>& nums) {
        sort(nums.begin(),nums.end());
        int x;
        for(int i=0;i<nums.size();i++){
            if(nums[i]==nums[i+1])
            {x=nums[i];
             break;}
        }
        return x;
    }
};