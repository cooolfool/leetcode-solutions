class Solution {
    public int minSubArrayLen(int target, int[] nums) {     
            int left=0,right=0,sum=0, min=nums.length+1,flag=0;
            // while(right<nums.length){
            //     sum+=nums[right];
            //     while(sum>=target){                   
            //         min=Math.min(999999,right-left+1);
            //         sum-=nums[left];
            //         left++; 
            //     }
            //     right++;
            // }
             for (int end = 0; end < nums.length; end++) {
            sum += nums[end];
            while (sum >= target) {
                min = Math.min(min, end - left + 1);
                sum -= nums[left];
                left++;
            }
        }
            return min==nums.length+1?0:min;
    }
}