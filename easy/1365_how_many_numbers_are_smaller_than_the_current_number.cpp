class Solution {
public:
    vector<int> smallerNumbersThanCurrent(vector<int>& nums) {
        int x=nums.size();
        vector<int>v;
        int h[500]={0};
        for(int i=0;i<x;i++){
            int count=0;
            for(int j=0;j<x;j++){
                if(nums[i]>nums[j]){
                 count++;   
                }
                }
            v.push_back(count);
        }
        /*for(int i=0;i<x;i++){
            v.push_back(h[i]);
        }*/
        return v;
    }
};