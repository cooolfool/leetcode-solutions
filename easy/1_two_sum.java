class Solution {
    public int[] twoSum(int[] nums, int target) {
        
            Map<Integer,Integer> targetMap = new HashMap();
            int res[]= new int[2];
            for(int i = 0;i<nums.length;i++){
                    int tempTarget = target-nums[i];
                    if(targetMap.containsKey(tempTarget)){
                            res[0] = i;
                            res[1] = targetMap.get(tempTarget);
                            return res;
                    }

                    targetMap.put(nums[i],i);
            }
        return res;
    }
}