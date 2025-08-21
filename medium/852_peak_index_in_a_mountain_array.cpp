class Solution {
public:
    int peakIndexInMountainArray(vector<int>& a) {
        int low=0,ans,n=a.size();
        int  high=a.size()-1,mid;
        while(low<=high)
        {
            mid=low+(high-low)/2;
            if((mid>0 and mid<a.size()-1) and a[mid]>a[mid-1] and a[mid]>a[mid+1])
            { 
                ans=mid;
                return mid;
                break;
            }
            else if(a[mid]>a[(mid+n-1)%n] and a[mid]<a[(mid+1)%n])
                low=mid+1;
            else if(a[mid]<a[(mid+n-1)%n] and a[mid]>a[(mid+1)%n])
                high=mid-1;
        }
        return ans;
    }
};