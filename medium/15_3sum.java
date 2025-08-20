class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        int len = nums.length;
        
        Set<List<Integer>> resultSet = new HashSet<>();
        Arrays.sort(nums);
         for (int i = 0; i < len; i++) {
            int target = -nums[i];
            int low = i+1, high = len - 1;
            while(low<high){
               int sum = nums[low]+nums[high];
                if(sum==target){
                    resultSet.add(Arrays.asList(nums[i],nums[low],nums[high]));
                    low++;
                    high--;
                }
                else if(sum>target)
                high--;
                else
                low++;
            }
        }
        List<List<Integer>> resultList = new ArrayList<>(resultSet);
        return resultList;
    }
}