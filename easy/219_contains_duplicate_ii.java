class Solution {
    public boolean containsNearbyDuplicate(int[] nums, int k) {
        
        int len= nums.length;
        Map<Integer,Integer> map = new HashMap<>();
        for(int i=0;i<len;i++){
            if(map.containsKey(nums[i])){
                if(Math.abs(map.get(nums[i])-i)<=k)
                return true;
                else
                map.put(nums[i],i);
            }
            else{
                map.put(nums[i],i);
            }
        }
     return false;

    }
}