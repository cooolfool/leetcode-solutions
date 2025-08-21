class Solution {
public:
    vector<int> rearrangeArray(vector<int>& nums) {
        vector<int>pos,neg,res;
        for(int i=0;i<nums.size();i++){
            if(nums[i]<0)
                neg.push_back(nums[i]);
            else
                pos.push_back(nums[i]);
        }
        for(int i=0;i<nums.size();i++){
            if(i==0 || i%2==0)
                res.push_back(pos[i/2]);
            else
                res.push_back(neg[i/2]);
        }
        return res;
    }
};