class Solution {
public:
    int numIdenticalPairs(vector<int>& nums) {
        
       int h[110]={1};
        long count=0;
       for(int i=0;i<nums.size();i++){
           h[nums[i]]++;
       } 
        int size = sizeof(h)/sizeof(h[0]);
        for(int i=1;i<=100;i++){
            if(h[i]>1){
                count+=(h[i]*(h[i]+1)/2)-h[i];
            }
        }
        return count;
    }
};