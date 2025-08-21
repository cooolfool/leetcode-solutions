class Solution {
public:
   vector<int> nextGreaterElements(vector<int>& nums) {
        //stack<int> st;
        vector<int> output;
        int N=nums.size();
        int max=*max_element(nums.begin(),nums.end());
        for(int j=0;j<N;j++)
        {
            if(nums[j]==max){
            output.push_back(-1);
            continue;}
        for(int i=j;(i+1)%N!=j;i++)
        {
         if(nums[(i+1)%N]>nums[j])
          {
            output.push_back(nums[(i+1)%N]);
            break;
          }
        }
        }
        return output;
    }
};