class Solution {
public:
    bool isValid(string s) {
        vector<char>v;
        for(int i=0;i<s.size();i++){
            if(s[i]=='a' or s[i]=='b'){
                v.push_back(s[i]);
            }
            else{
                if(v.size()>=2 and v[v.size()-1]=='b' and v[v.size()-2]=='a'){
                    v.pop_back();
                    v.pop_back();
                }
                else
                    return false;
            }
        }
        return v.empty();
    }
};