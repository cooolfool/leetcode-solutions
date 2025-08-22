class Solution {
    public int longestOnes(int[] nums, int k) {
        int l = 0 ,r = 0, maxLen = 0, zeroes = 0, len = nums.length;

        while(r<len){
                if(nums[r]==0){
                    zeroes++;
                }
                if(zeroes>k){
                    if(nums[l]==0){
                        zeroes--;
                    }
                        l++;
                    
                   
                }
                else if(zeroes<=k){
                    maxLen = Math.max(maxLen,r-l+1);
                }
               
            r++;

        }
        return maxLen;
    }
}