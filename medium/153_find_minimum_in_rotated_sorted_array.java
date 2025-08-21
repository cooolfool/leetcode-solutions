class Solution {
    public int findMin(int[] nums) {
        int low = 0;
        int high = nums.length - 1;
        int mid = low + (high - low) / 2;
        if (nums[low] < nums[high])
            return nums[low];
        while (low < high) {
            mid = low + (high - low) / 2;
            if (nums[mid] > nums[mid + 1])
                return nums[mid + 1];
            else if (nums[mid] < nums[mid - 1])
                return nums[mid];

            if (nums[mid] > nums[high]) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return nums[low];
    }
}