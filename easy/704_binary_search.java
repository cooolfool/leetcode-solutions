import java.util.*;
class Solution {
    public int search(int[] nums, int target) {
        int low=0;
        int high=nums.length-1;
        while(low<=high){
            int mid=(low+high)/2;
            int mid_val=nums[mid];
            if(mid_val==target){
                return mid;
            }
            else if(mid_val<target){
                low=mid+1;
            }
            else if(mid_val>target){
                high=mid-1;
            }
        }
        return -1;
    }
}