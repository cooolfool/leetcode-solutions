class Solution {
public:
    vector<int> intersect(vector<int>& nums1, vector<int>& nums2) {
          map<int,int>m;
        vector<int>v;
        if(nums1.size()>=nums2.size()){
        for(int i=0;i<nums1.size();i++){
            m[nums1[i]]++;
        }
        for(int i=0;i<nums2.size();i++){
            if(m[nums2[i]]>0){
                //if(find(v.begin(),v.end(),nums2[i])==v.end())
                v.push_back(nums2[i]);
            }
            m[nums2[i]]--;
        }
        }
        else{
            for(int i=0;i<nums2.size();i++){
            m[nums2[i]]++;
        }
        for(int i=0;i<nums1.size();i++){
            if(m[nums1[i]]>0){
                v.push_back(nums1[i]);
            }
             m[nums1[i]]--;
        }
        }
        return v;
    }
};