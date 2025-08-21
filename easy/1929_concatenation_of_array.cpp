class Solution {
public:
    vector<int> getConcatenation(vector<int>& nums) {
        vector<int>res;
        int n=nums.size(),j=0;
        for(int i=0;i<2*n;i++){
            if(i>=n){             
                res.push_back(nums[j]);
                j++;
        }
            else
                res.push_back(nums[i]);
        }
        return res;
    }
};