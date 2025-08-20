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
                //Target lies in left part
                high--;
            }
            else{
                low++;
            }
        }
        return res;
    }
}