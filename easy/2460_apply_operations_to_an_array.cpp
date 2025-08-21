class Solution {
public:
    vector<int> applyOperations(vector<int>& nums) {
         int len=nums.size();
        vector<int>res;
        int count=0;
        //fill(res.begin(),res.end(),0);
       
        for(int i=0;i<len-1;i++){
            if(nums[i]==nums[i+1]){
                nums[i]*=2;
                nums[i+1]=0;
            }
        }
        //int zeros=count(nums.begin(),nums.end(),0);
        for(int i=0;i<len;i++){
            if(nums[i]!=0)
                res.push_back(nums[i]);
            else count++;
        }
        while(count>0){
            res.push_back(0);
            count--;
        }
        //for(int i=len-zeros-1;i<len;i++){
           // if(res[i]<=0)
          //      res[i]=0;
        //}
        return res;
    }
};