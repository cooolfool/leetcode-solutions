class Solution {
public:
    int searchInsert(vector<int>& a, int target) {
        int low=0,high=a.size()-1,mid,ans=0;
        while(low<=high)
        {
            mid=low+(high-low)/2;
           /* if(a[mid]<target)
            {  
             return mid;
            }
            */
            if(a[mid]<target)
            {
                ans=mid+1;
                low=mid+1;
            }
            else
                high=mid-1;
        }
        return ans;
    }
};