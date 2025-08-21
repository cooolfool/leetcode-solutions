class Solution {
    public int majorityElement(int[] nums) {
        int len=nums.length;
        Arrays.sort(nums);
        int count=1;
        int max=0;
        int res=-100;
        if(len<=1){
            return nums[0];
        }
        else{
            for(int i=1;i<len;i++){
                if(nums[i]==nums[i-1]){
                    count++;
                     if(count>=max){
                        max=count;
                        res=nums[i];
                    }
                }
                else{
                   count=1;
                }
            }
        }
        return res;
    }
}