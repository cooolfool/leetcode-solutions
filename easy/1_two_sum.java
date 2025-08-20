class Solution {
    public int[] twoSum(int[] nums, int target) {
        Map<Integer,Integer> map = new HashMap<>();
        int len = nums.length;
        int low = 0,high = len-1;
        for(int i = 0;i<len;i++){
            int num = target-nums[i];
            if(map.containsKey(num))
            return new int[] {map.get(num),i};
            else
            map.put(nums[i],i);
        }
        return new int[0];
    }
}