import java.util.Arrays;

class Solution {
    public int maxFrequency(int[] nums, int k) {
        Arrays.sort(nums);
        int low = 0,maxFreq = 1;
        long ops = 0;
        for (int high = 1; high < nums.length; high++) {
            ops += ((long)nums[high] - (long)nums[high - 1]) * (high - low);
            while (ops > k) {
                ops -= (long)nums[high] - (long)nums[low];
                low++;
            }
            maxFreq = Math.max(maxFreq, high - low + 1);
        }
        return Math.min(maxFreq, nums.length);
    }
}
