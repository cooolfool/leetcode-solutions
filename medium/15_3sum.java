class Solution {
    public List<List<Integer>> threeSum(int[] nums) {
        int len=nums.length;
        Arrays.sort(nums);
        List<List<Integer>> lst = new ArrayList<>();
        if(nums[0]>0)
        return lst;
        Set<List<Integer>> integerSet = new HashSet<>();
        for(int i=0;i<len;i++){
             int left = 0;
             int right = len-1;
            //int[] list=new int[3];
            int target = 0-nums[i];
            while(left < right && left!=i && right!=i){
                List<Integer> list = new ArrayList<>();
                if (nums[left]+nums[right]==target) {
                  list.add(nums[i]);
                  list.add(nums[left]);
                  list.add(nums[right]);
                  Collections.sort(list);
                  integerSet.add(list); 
                  right--;                
                 } 
              else if (nums[left]+nums[right]<target) {
                   left++; // Target may be in the right half
                 } 
              else {
                    right--; // Target may be in the left half
                 }
            }  
        }
       for(List<Integer> ls : integerSet){
           lst.add(ls);
       }
          return lst;
    }
}