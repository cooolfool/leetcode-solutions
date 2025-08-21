class Solution {
public:
    vector<int> nextGreaterElement(vector<int>& nums1, vector<int>& nums2) {
        stack<int>s;
        vector<int>v;
        vector<int>result;
        for(int i=nums2.size()- 1;i>=0;i--){
            if(s.empty()){
                v.push_back(-1);
                s.push(nums2[i]);
            }
            else if(s.top()>nums2[i]){
                v.push_back(s.top());
                s.push(nums2[i]);
            }
            else 
            { 
                    while(!s.empty() and s.top()<=nums2[i]){
                    s.pop();
                    }
                if(s.empty()){
                    v.push_back(-1);
                    s.push(nums2[i]);
                }
                else if(s.top()>nums2[i]){
                    v.push_back(s.top());
                    s.push(nums2[i]);
                }
                }
        }
        reverse(v.begin(),v.end());
        for(int i=0;i<nums1.size();i++)
        {
            int pos=find(nums2.begin(),nums2.end(),nums1[i])-nums2.begin();
            result.push_back(v[pos]);       
        }
        return result;
       }
};