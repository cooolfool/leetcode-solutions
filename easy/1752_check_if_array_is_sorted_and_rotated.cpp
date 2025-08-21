class Solution {
public:
    bool check(vector<int>& nums) {
      int temp=0;
        int n=nums.size();
        for(int i=0;i<=n-2;i++){
            if(nums[i]>nums[i+1])
                temp++;
        }
        if(temp==0)
            return true;
        else if(temp==1){
            if(nums[n-1]<=nums[0]){
                return true;
            }
            else return false;
        } 
           else 
               return false;
    }
};