class Solution {
    public int removeElement(int[] nums, int val) {
        int count=0;
        int i=0;
        int j=0;
        int[] res=new int[nums.length];
        for(int value:nums){
            if(value!=val){
                res[i]=value;
                i++;
            }
        }
        for(int flag:res){
            nums[j]=flag;
            j++;
        }
        return i;
    }
}