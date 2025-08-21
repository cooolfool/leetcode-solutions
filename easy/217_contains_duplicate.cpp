class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        sort(nums.begin(),nums.end());
        /*vector<int>hash(nums[nums.size()-1],0);
        for(int i=0;i<nums.size();i++)
        {
            hash[nums[i]]++;
            if(hash[nums[i]]>1)
                return true;
        }
        return false;*/
        for(int i=0;i<nums.size()-1;i++){
            if(nums[i]==nums[i+1])
                return true;
        }
        return false;
    }
    
};