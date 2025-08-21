class Solution {
    public int longestConsecutive(int[] nums) {
        Arrays.sort(nums);
        int res=1;
        int temp=0;
        int count=1;
        int len=nums.length;
        if(len==0)
        return 0;
        for(int i=1;i<len;i++){
            if(nums[i]==nums[i-1]+1 || nums[i]==nums[i-1]){
                if(nums[i]==nums[i-1])
                continue;
                count++;
                temp=count;
            }
            else{
                if(count>res)
                    res=count;
                count=1;
            }
        }
        if(temp>res)
        return temp;
        return res;
    }
}