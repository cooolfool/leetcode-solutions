class Solution {
    public int[] twoSum(int[] nums, int target) {
        int len = nums.length;
        int res[] = new int[2];
        int low = 0,high = len-1;
        for(int i=0;i<len;i++){
            if(nums[low]+nums[high]==target){
                res[0] = low+1;
                res[1] = high+1;
                break;
            }
            else if(nums[low]+nums[high] > target){
               //the sum is greater than the target so updating high value to lower one as array is sorted
                high--;
            }
            else{
                 //the sum is lesser than the target so updating low value to highr one as array is sorted
                low++;
            }
        }
        return res;
    }
}