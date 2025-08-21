class Solution {
    public int hIndex(int[] nums) {
        Arrays.sort(nums);
        int len=nums.length;
        int res=1;
        for(int i= len-1;i>=0;i--){
           
            if(nums[i]>=res)
             res++;
             else break;
        }
        return res-1;
    }
}