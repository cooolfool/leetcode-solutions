class Solution {
    public int[] searchRange(int[] nums, int target) {

        int[] res = { -1, -1 };
        int len = nums.length;
        int low = 0, high = len - 1;
        int left = leftBinarySearch(low,high,nums,target);
        int right = rightBinarySearch(low,high,nums,target);
        res[0]=left;
        res[1]=right;
        return res;

    }

    public int leftBinarySearch (int low, int high, int[] nums, int target){
        int left=-1;
        while(low<=high){
            int mid = low+(high-low)/2;
            if(nums[mid]==target){
                    high = mid-1;
                    left = mid;
            }
            else if(nums[mid]>target){
                high = mid-1;
            }
            else{
                low = mid+1;
            }
        }
        return left;
    }

    public int rightBinarySearch (int low, int high, int[] nums, int target){
        int right=-1;
        while(low<=high){
            int mid = low+(high-low)/2;
            if(nums[mid]==target){
                    low = mid+1;
                    right = mid;
            }
            else if(nums[mid]>target){
                high = mid-1;
            }
            else{
                low = mid+1;
            }
        }
        return right;
    }



    public int[] binarySearch(int low, int high, int[] nums, int target) {
        int[] res = { -1, -1 };
        int len = nums.length;
        int left = -1;
        int right = -1;
        while (low <= high) {
            int mid = low + (high - low) / 2;
            if (nums[mid] == target) {
                if (mid > 0 && nums[mid - 1] == target) {
                    high = mid - 1;
                    right = mid;
                    left = mid - 1;
                    if(low<=high)
                    return binarySearch(low, high, nums, target);
                }
                if (mid < len - 1 && nums[mid + 1] == target) {
                    low = mid + 1;
                    right = mid + 1;
                    left = mid;
                    if(low<=high)
                    return binarySearch(low, high, nums, target);
                } else {
                    res[0] = mid;
                    res[1] = mid;
                    return res;
                }
            } else if (nums[mid] > target) {
                high = mid - 1;
            } else
                low = mid + 1;
        }
        res[0] = left;
        res[1] = right;
        return res;
    }
}
