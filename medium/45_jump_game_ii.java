import java.util.Arrays;

class Solution {
    public int jump(int[] nums) {
        int len = nums.length;
        int[] res = new int[len];
        Arrays.fill(res, Integer.MAX_VALUE - 1);

        res[len - 1] = 0;

        for (int i = len - 2; i >= 0; i--) {
            int maxJump = Math.min(i + nums[i], len - 1);
            for (int j = i + 1; j <= maxJump; j++) {
                res[i] = Math.min(res[i], res[j] + 1);
            }
        }

        return res[0];
    }
}
