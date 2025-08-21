class Solution {
    public int[] twoSum(int[] nums, int target) {
        int len =nums.length;
        int res1=-1;
        int res2=-1;
        int res[]=new int[2];
        int temp[]=new int[len];
        int flag=0;
        // for(int i=0;i<len;i++){
        //     temp[i]=target-nums[i];
        // }


        //Binary search
        
            int left = 0;
            int right = nums.length - 1;
            while (left <= right) {
              //int mid = left + (right - left) / 2;
              if (nums[left]+nums[right]==target) {
                  res[0]=left+1;
                  res[1]=right+1;
                  return res;  
                  
                 } 
              else if (nums[left]+nums[right]<target) {
                   left++; // Target may be in the right half
                 } 
              else {
                    right--; // Target may be in the left half
                 }
             }
           
        
        // for(int i=0;i<len;i++){
        //     int x = numbers[i];
        //     for(int j=i+1;j<len;j++){
        //         int y=numbers[j];
        //         if(x+y==target){
        //             res1=i+1;
        //             res2=j+1;
        //         }
        //     }
        // }
        
        // res[0]=res1+1;
        // res[1]=res2+1;
      return res;
    }
}