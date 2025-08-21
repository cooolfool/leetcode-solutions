class Solution {
    public int removeDuplicates(int[] nums) {
        int i=1;
        int count=1;
        for(int j=1;j<nums.length;j++){
            if(nums[j]==nums[j-1]){
                if(count<2){
                nums[i]=nums[j];
                i++;
                count++;
            }
            }
            else{
                nums[i]=nums[j];
                count=1;
                i++;
            }
        }
        return i;
    }
}