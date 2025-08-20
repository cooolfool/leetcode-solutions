class Solution {
    public int[] productExceptSelf(int[] nums) {
        int len=nums.length;
        int[] res=new int[len];
        int prod=1;
        int isZero=0;
        for(int i=0;i<len;i++){
            if(nums[i]!=0)
            prod*=nums[i];
            else
            isZero++;
        }
        for(int i=0;i<len;i++){
            if(isZero>1)
            res[i]=0;
            else if(isZero>0 && nums[i]!=0)
            res[i]=0;
            else if(isZero>0 && nums[i]==0)
            res[i]=prod;
            else
            res[i]=prod/nums[i];
        }
        return res;
    }
}