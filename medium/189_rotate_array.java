// class Solution {
//     public void rotate(int[] nums, int k) {
//         int len=nums.length;
//         k=k%len;
//         while(k>0){
//             int val=nums[len-1];
//             for(int i=len-1;i>0;i--){
//                     nums[i]=nums[i-1];
//             }
//             nums[0]=val;
//             k--;
//         }
//     }
// }


class Solution {
	 public static void reverse(int nums[], int i, int j){
        int li = i;
        int ri = j;
        
        while(li < ri){
            int temp = nums[li];
            nums[li] = nums[ri];
            nums[ri] = temp;
            
            li++;
            ri--;
        }
    }
    public void rotate(int[] nums, int k) {
        k = k % nums.length; 
        if(k < 0){ 
            k += nums.length;
        }
        reverse(nums, 0, nums.length - k - 1);
        reverse(nums, nums.length - k, nums.length - 1);
        reverse(nums, 0, nums.length - 1);
    }
}

